export interface RawReceiptItem {
    description: string;
    quantity: number;
    unitPrice: number;
    totalLinePrice: number;
}

export interface SanitizedReceiptItem {
    description: string;
    amount: number;
    quantity: number;
}

export function sanitizeReceiptItems(items: RawReceiptItem[], currency: string): SanitizedReceiptItem[] {
    return items.map(item => {
        // 1. Force quantity to be at least 1
        const quantity = Math.max(1, item.quantity || 1);
        
        // 2. Trust totalLinePrice as the absolute truth
        let totalLinePrice = item.totalLinePrice;
        let unitPrice = item.unitPrice;

        // If totalLinePrice is missing but we have unitPrice, calculate it
        if ((totalLinePrice === undefined || totalLinePrice === null || totalLinePrice === 0) && unitPrice > 0) {
            totalLinePrice = unitPrice * quantity;
        }
        
        // If unitPrice is missing but we have totalLinePrice, calculate it
        if ((unitPrice === undefined || unitPrice === null || unitPrice === 0) && totalLinePrice > 0) {
            unitPrice = totalLinePrice / quantity;
        }

        // 3. Validation and correction logic
        const calculatedTotal = unitPrice * quantity;
        
        // Check if there is a significant discrepancy (tolerance for floating point)
        // For PYG (Guaranis), we expect integers usually, but let's be safe.
        // User rule: "Se (quantidade * preco_unitario) for diferente de preco_total_da_linha, force o preco_unitario = preco_total_da_linha / quantidade."
        
        // We use a small epsilon for float comparison unless it's strictly integer based currency
        const epsilon = 0.01;
        
        if (Math.abs(calculatedTotal - totalLinePrice) > epsilon) {
            // Mismatch detected. Recalculate unit price based on total line price.
            unitPrice = totalLinePrice / quantity;
        }

        // 4. Apply rounding based on currency
        if (currency === 'PYG') {
            unitPrice = Math.round(unitPrice);
        } else {
             // For other currencies, maybe 2 decimals? The user didn't specify for others, 
             // but standard is usually 2 decimals. Let's keep it as is or just standard round if needed.
             // But strictly following user instruction: "Use Math.round() para valores em Guaranis (PYG)"
        }

        return {
            description: item.description,
            amount: unitPrice, // application expects unit price in 'amount'
            quantity: quantity
        };
    });
}
