import React, { useEffect, useState } from 'react';
import type { Preview } from '@storybook/react';

// Import RDT styles
import '../src/variables.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const [isDark, setDark] = useState(false);

      useEffect(() => {
        // Update the Storybook root background and apply dark class
        const sbRoot = document.getElementsByClassName(
          'sb-show-main',
        )[0] as HTMLElement;

        if (sbRoot) {
          sbRoot.style.backgroundColor = isDark
            ? 'hsl(240 10% 3.9%)'
            : 'hsl(0 0% 100%)';
        }

        // Apply dark class to document for CSS variable theming
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, [isDark]);

      return (
        <div className={isDark ? 'dark' : ''}>
          <p
            style={{
              paddingBottom: '0.5rem',
              color: isDark ? '#fff' : '#666',
              fontSize: '0.875rem',
            }}
          >
            Looking for the main docs site? Click{' '}
            <a
              href="https://www.material-react-table.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: isDark ? '#90caf9' : '#1976d2' }}
            >
              here.
            </a>
          </p>
          <p
            style={{
              paddingBottom: '1rem',
              color: isDark ? '#fff' : '#666',
              fontSize: '0.875rem',
            }}
          >
            View Source code for these examples in the code tab below or{' '}
            <a
              href="https://github.com/KevinVandy/material-react-table/tree/v3/packages/react-data-table/stories"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: isDark ? '#90caf9' : '#1976d2' }}
            >
              here on GitHub.
            </a>
          </p>
          <Story {...context} />
        </div>
      );
    },
  ],
};

export default preview;
