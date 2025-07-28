package com.luv2code.spring_boot_library.Service;

import com.luv2code.spring_boot_library.Dao.BookRepository;
import com.luv2code.spring_boot_library.Dao.CheckoutRepository;
import com.luv2code.spring_boot_library.Entities.Book;
import com.luv2code.spring_boot_library.Entities.Checkout;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional

public class BookServiceImpl implements IBookService {
    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;


    public BookServiceImpl(BookRepository bookRepository, CheckoutRepository checkoutRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
    }
    @Override
    public Book checkoutBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> book=bookRepository.findById(bookId);

        Checkout validateCheckout=checkoutRepository.findByUserEmailAndBookId(userEmail,bookId);

        if(book.isEmpty() || validateCheckout!=null || book.get().getCopiesAvailable()<=0){
            throw new Exception("Book doesn't exist or already checked out by user");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable()-1);
        bookRepository.save(book.get());

        Checkout checkout=new Checkout(
                null,
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get()
        );

        checkoutRepository.save(checkout);

        return book.get();

    }

    @Override
    public Boolean checkoutBookByUser(String userEmail, Long bookId) {
          Checkout validatecheckout=checkoutRepository.findByUserEmailAndBookId(userEmail,bookId);
          if(validatecheckout!=null) return true;
          else return false;
    }

    @Override
    public int currentLoanCount(String userEmail) {
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }
}
