package com.luv2code.spring_boot_library.Service;

import com.luv2code.spring_boot_library.Entities.Book;

public interface IBookService {
    public Book checkoutBook(String userEmail, Long bookId) throws Exception;
    public Boolean checkoutBookByUser(String userEmail,Long bookId);
    public int currentLoanCount(String userEmail);
}
