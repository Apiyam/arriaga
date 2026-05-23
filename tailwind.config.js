/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./**/*.tsx"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
        },
		gridTemplateColumns: {
			'1': 'repeat(1, minmax(0, 1fr))',
			'2': 'repeat(2, minmax(0, 1fr))',
			'3': 'repeat(3, minmax(0, 1fr))',
			'4': 'repeat(4, minmax(0, 1fr))',
			'5': 'repeat(5, minmax(0, 1fr))',
			'6': 'repeat(6, minmax(0, 1fr))',
			'7': 'repeat(7, minmax(0, 1fr))',
			'8': 'repeat(8, minmax(0, 1fr))',
			'9': 'repeat(9, minmax(0, 1fr))',
			'10': 'repeat(10, minmax(0, 1fr))',
			'11': 'repeat(11, minmax(0, 1fr))',
			'12': 'repeat(12, minmax(0, 1fr))',
			'13': 'repeat(13, minmax(0, 1fr))',
			'14': 'repeat(14, minmax(0, 1fr))',
			'15': 'repeat(15, minmax(0, 1fr))',
			'16': 'repeat(16, minmax(0, 1fr))',
			'17': 'repeat(17, minmax(0, 1fr))',
			'18': 'repeat(18, minmax(0, 1fr))',
			'19': 'repeat(19, minmax(0, 1fr))',
			'20': 'repeat(20, minmax(0, 1fr))',
			'21': 'repeat(21, minmax(0, 1fr))',
		  }
  	}
	  
  },
  plugins: [require("tailwindcss-animate")],
};
