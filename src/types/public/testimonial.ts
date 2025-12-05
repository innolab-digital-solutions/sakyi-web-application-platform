export interface Testimonial {
    id: number;
    user: {
        picture: string;
        name: string;
        age: number | null;

    };
    program: {
        title: string;
    };
    rating: number;
    comment: string;
}
