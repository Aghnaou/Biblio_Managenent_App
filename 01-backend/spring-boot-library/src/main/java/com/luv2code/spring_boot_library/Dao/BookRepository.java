package com.luv2code.spring_boot_library.Dao;

import com.luv2code.spring_boot_library.Entities.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface BookRepository  extends JpaRepository<Book,Long> {
       Page<Book> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);
       Page<Book> findByCategory(@RequestParam("category") String category,Pageable pageable);
       Page<Book> findByTitleContainingOrCategory(@RequestParam("title") String title,@RequestParam("title") String category, Pageable pageable);
}
