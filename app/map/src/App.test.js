import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
	render(<App />);
	const linkElement = screen.getByText(/Getting Started with UI5 Web Component for React/i);
	expect(linkElement).toBeInTheDocument();
});
