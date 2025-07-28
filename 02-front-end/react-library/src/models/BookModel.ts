class BookModel {
  id: number;
  title: string;
  author?: string;
  description?: string;
  copies?: number;
  copiesAvailable?: number;
  category?: string;
  img?: string;

  constructor(
    id: number,
    title: string,
    author: string,
    description: string,
    copies: number,
    copiesAvailable: number,
    category: string,
    img: string
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.category = category;
    this.copies = copies;
    this.copiesAvailable = copiesAvailable;
    this.description = description;
    this.img = img;
  }
}

export default BookModel;
