declare module '*.css' {
    const content: string;
    export default content;
}

interface CustomElementRegistry {
    unlink(name: string): boolean;
}
