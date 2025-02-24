// components/BlackVisaIcon.tsx
import React from 'react';

const BlackVisaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="m31 13h33c3 0 12-1 16 13 3 9 7 23 13 44h2c6-22 11-37 13-44 4-14 14-13 18-13h31v96h-32v-57h-2l-17 57h-24l-17-57h-3v57h-31m139-96h32v57h3l21-47c4-9 13-10 13-10h30v96h-32v-57h-2l-21 47c-4 9-14 10-14 10h-30m142-29v29h-30v-50h98c-4 12-18 21-34 21" fill="currentColor" />
        <path d="m382 53c4-18-8-40-34-40h-68c2 21 20 40 39 40" fill="currentColor" />
    </svg>
);

export default BlackVisaIcon;