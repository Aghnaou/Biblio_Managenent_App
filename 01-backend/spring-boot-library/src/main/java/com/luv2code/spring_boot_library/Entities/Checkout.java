package com.luv2code.spring_boot_library.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "checkout")
@AllArgsConstructor @NoArgsConstructor @Setter @Getter

public class Checkout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
     private Long id;
    @Column(name = "user_email")
    private  String userEmail;
    @Column(name = "checkout_date")
    private String checkoutDate;
    @Column(name = "return_date")
    private String returnDate;
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "book_id")
    private Book book;
    //@Column(name = "book_id")
    //private Long bookId;







}
