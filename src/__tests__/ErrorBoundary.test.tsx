import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '../app/components/ErrorBoundary';

function ProblemChild() {
    throw new Error('Test error');
}

function GoodChild() {
    return <div>Everything is fine</div>;
}

describe('ErrorBoundary', () => {
    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <GoodChild />
            </ErrorBoundary>
        );
        expect(screen.getByText('Everything is fine')).toBeInTheDocument();
    });

    it('renders fallback UI when a child throws', () => {
        vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <ErrorBoundary>
                <ProblemChild />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();

        vi.restoreAllMocks();
    });

    it('renders custom fallback when provided', () => {
        vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <ErrorBoundary fallback={<div>Custom error page</div>}>
                <ProblemChild />
            </ErrorBoundary>
        );

        expect(screen.getByText('Custom error page')).toBeInTheDocument();

        vi.restoreAllMocks();
    });

    it('recovers when retry button is clicked', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => { });
        let shouldThrow = true;

        function ConditionalChild() {
            if (shouldThrow) {
                throw new Error('Conditional error');
            }
            return <div>Recovered</div>;
        }

        render(
            <ErrorBoundary>
                <ConditionalChild />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();

        shouldThrow = false;
        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: /try again/i }));

        expect(screen.getByText('Recovered')).toBeInTheDocument();

        vi.restoreAllMocks();
    });
});
