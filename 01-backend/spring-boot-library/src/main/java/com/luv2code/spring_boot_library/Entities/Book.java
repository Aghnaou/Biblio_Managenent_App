
package com.luv2code.spring_boot_library.Entities;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;

@Entity
@Table(name = "book")
@Setter @Getter @AllArgsConstructor  @NoArgsConstructor @ToString
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "title")
    private String title;
    @Column(name = "author")
    private String author;
    @Column(name = "description")
    private String description;
    @Column(name = "copies")
    private int copies;
    @Column(name = "copies_available")
    private int copiesAvailable;
    @Column(name = "category")
    private String category;
    @Column(name = "img")
    private  String img;
    @OneToMany(mappedBy = "book",fetch = FetchType.LAZY)
    @JsonManagedReference
    private Collection<Review> review;
    @OneToMany(mappedBy = "book",fetch = FetchType.LAZY)
    @JsonManagedReference
    private Collection<Checkout> checkouts;

}
