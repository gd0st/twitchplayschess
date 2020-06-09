import React, { ComponentPropsWithoutRef, forwardRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<'button'>;

export const style = {};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{ children }: ButtonProps,
	ref
) {
	return (
		<button type='button' ref={ref}>
			{children}
		</button>
	);
});

export default Button;
