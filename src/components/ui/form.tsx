import * as React from 'react';

// Simple form stub - not used in current project
export const Form: React.FC<any> = ({ children }) => <form>{children}</form>;
export const FormField: React.FC<any> = () => null;
export const FormItem: React.FC<any> = ({ children }) => <div>{children}</div>;
export const FormLabel: React.FC<any> = ({ children }) => <label>{children}</label>;
export const FormControl: React.FC<any> = ({ children }) => <div>{children}</div>;
export const FormDescription: React.FC<any> = ({ children }) => <p>{children}</p>;
export const FormMessage: React.FC<any> = ({ children }) => <p>{children}</p>;
export const useFormField = () => ({});
