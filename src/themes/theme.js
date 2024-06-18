import { extendTheme } from '@chakra-ui/react';

const breakpoints = {
	base: '0em',
	sm: '768px',
	md: '1024px',
	lg: '1280px',
	xl: '1536px',
	'2xl': '1920px',
};

const theme = extendTheme({
	breakpoints,
	components: {
		Input: {
			baseStyle: () => ({
				field: {
					backgroundColor: 'var(--input) !important',
                    '_focusVisible': {
                        'border-color': 'var(--primary) !important',
                        'box-shadow': '0 0 0 1px var(--primary)'
                    }
				},
			}),
		},
	},
});

export { breakpoints, theme };