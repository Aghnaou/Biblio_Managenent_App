package com.luv2code.spring_boot_library.Controller;

import com.luv2code.spring_boot_library.Entities.Book;
import com.luv2code.spring_boot_library.Service.BookServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http:://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {
    private BookServiceImpl bookService;

    //@Autowired
    public BookController(BookServiceImpl bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount(){
        String userEmail="testuser@gmail.com";
        return bookService.currentLoanCount(userEmail);
    }

    @GetMapping("/secure/ischeckout/byuser")
    public Boolean checkoutBookByUser(@RequestParam Long bookId){
        String userEmail="testuser@gmail.com";
        return bookService.checkoutBookByUser(userEmail,bookId);
    }


    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestParam Long bookId) throws Exception{
       String userEmail="testuser@gmail.com";
       return bookService.checkoutBook(userEmail,bookId);
    }
}
