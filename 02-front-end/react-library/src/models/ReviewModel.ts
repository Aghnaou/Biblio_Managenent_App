class ReviewModel {
  id: number;
  userEmail: string;
  date: string;
  rating: number;
  book_id: number;
  reviewDescription?: string;

  constructor(
    id: number,
    userEmail: string,
    date: string,
    rating: number,
    book_id: number,
    reviewDescription: string
  ) {
    this.id = id;
    this.book_id = book_id;
    this.date = date;
    this.reviewDescription = reviewDescription;
    this.userEmail = userEmail;
    this.rating = rating;
  }
}

export default ReviewModel;
