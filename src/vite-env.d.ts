/// <reference types="vite/client" />

declare global {
    namespace JSX {
        interface IntrinsicElements {
            sandstormShaderMaterial: any;
            foliageMaterial: any;
        }
    }
}

declare module 'lucide-react/dist/esm/icons/*' {
    import { LucideIcon } from 'lucide-react';
    const icon: LucideIcon;
    export default icon;
}
