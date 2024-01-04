import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
const typeDefs = `#graphql

    enum Genre {
        Mystery
        Fantasy
        Classic
        Fiction
    }

    type Book {
        id: String
        title: String
        authorId: String
        genre: Genre
    }

    type Author {
        id: String
        name: String
        books: [Book]
    }

    type Query {
        books: [Book]
        book(id: String): Book
        authors: [Author]
        author(id:String): Author
        authorBooks(id: String): [Book]
    }

    input AddBookInput {
        title: String
        authorId:String
        genre: Genre
    }

    type Mutation {
        addBook(book: AddBookInput): Book
      }
`;
const resolvers = {
    Query: {
        books: () => books,
        book: (_, { id }) => books.find(book => book.id === id),
        authors: () => authors,
        author: (_, { id }) => authors.find(author => author.id === id),
        authorBooks: (_, { id }) => books.filter(book => book.authorId === id)
    },
    Mutation: {
        addBook: (_, { book }) => {
            const newBook = {
                id: String(books.length + 1),
                ...book
            };
            books.push(newBook);
            return newBook;
        }
    }
};
const books = [
    { id: '1', title: 'The Great Gatsby', authorId: '1', genre: 'Classic' },
    { id: '2', title: 'To Kill a Mockingbird', authorId: '2', genre: 'Classic' },
    { id: '3', title: 'The Catcher in the Rye', authorId: '3', genre: 'Classic' },
    { id: '4', title: 'Harry Potter and the Philosopher\'s Stone', authorId: '4', genre: 'Fantasy' },
    { id: '5', title: 'Tender Is the Night', authorId: '1', genre: 'Classic' },
    { id: '6', title: 'Harry Potter and the Chamber of Secrets', authorId: '4', genre: 'Fantasy' },
];
const authors = [
    { id: '1', name: 'F. Scott Fitzgerald', books: [] },
    { id: '2', name: 'Harper Lee', books: [] },
    { id: '3', name: 'J.D. Salinger', books: [] },
    { id: '4', name: 'J.K. Rowling', books: [] },
];
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
