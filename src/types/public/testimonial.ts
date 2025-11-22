export interface Testimonial {
    id: number;
    user: {
        picture: string;
        name: string;
    };
    program: {
        title: string;
    };
    rating: number;
    comment: string;
}
