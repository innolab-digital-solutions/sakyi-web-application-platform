export interface Testimonial {
    id: number;
    rating: number;
    comment: string;
    reviewer: {
      name: string;
      picture: string;
    };
    program: {
      id: number;
      title: string;
      thumbnail: string;
    };
  }
  