export declare function uidReset(): void;
export declare function uid(prefix: string): string;
export declare function org(): {
    id: string;
};
export declare function user(teamIds?: any[]): {
    id: string;
    teamIds: any[];
};
export declare function team(organization: any): {
    id: string;
    organizationId: any;
};
export declare function blog(organization: any): {
    id: string;
    organizationId: any;
};
export declare function post(blogDoc: any): {
    id: string;
    blogId: any;
};
