package com.clofit.backend.model;

/**
 * <<Model>> Category
 * Diagram:
 *   id: String
 *   name: String
 *   slug: String
 *   getId(): String
 *   getName(): String
 *   getSlug(): String
 */
public class Category {

    private String id;
    private String name;
    private String slug;

    public Category() {}

    public Category(String id, String name, String slug) {
        this.id   = id;
        this.name = name;
        this.slug = slug;
    }

    public String getId()          { return id; }
    public void setId(String id)   { this.id = id; }

    public String getName()        { return name; }
    public void setName(String n)  { this.name = n; }

    public String getSlug()        { return slug; }
    public void setSlug(String s)  { this.slug = s; }
}
