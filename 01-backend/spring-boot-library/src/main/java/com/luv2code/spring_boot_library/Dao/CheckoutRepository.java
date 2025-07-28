package com.luv2code.spring_boot_library.Dao;

import com.luv2code.spring_boot_library.Entities.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout,Long> {
    Checkout findByUserEmailAndBookId(String userEmail,Long BookId);
    List<Checkout> findBooksByUserEmail(String userEmail);
}
