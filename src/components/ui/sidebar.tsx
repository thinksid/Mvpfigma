import * as React from 'react';

// Simple sidebar stub - not used in current project
export const Sidebar: React.FC<any> = () => null;
export const SidebarProvider: React.FC<any> = ({ children }) => <>{children}</>;
export const SidebarTrigger: React.FC<any> = () => null;
export const SidebarInset: React.FC<any> = () => null;
export const SidebarContent: React.FC<any> = () => null;
export const SidebarGroup: React.FC<any> = () => null;
export const SidebarGroupLabel: React.FC<any> = () => null;
export const SidebarGroupContent: React.FC<any> = () => null;
export const SidebarMenu: React.FC<any> = () => null;
export const SidebarMenuItem: React.FC<any> = () => null;
export const SidebarMenuButton: React.FC<any> = () => null;
export const useSidebar = () => ({ state: 'expanded' });
