export interface User{
    name: string;
    phnumber: string;
    email: string;
    clg?:string;
    dob?: string;
    interests?:string[];
    experience?: '0 years' |'1-2 years' | '2-3 years' | '3-4 years' | '4-5 years' | '5+ years';
    bio: string;
    type: 'student'|'institute'|'enterprise';
    imageUrl:string | '/Default_pfp.jpg';
}

export interface Project{
    Category: string;
    Hashtags: string[];
    Owner: string;
    Techlang: string;
    projectID: string;
    title: string;
    thumbnailurl: string;
    description?: string;
    yturl?: string;
    
}