package com.clofit.model;

/**
 * Category — phân loại sản phẩm.
 * Quan hệ: Product N–1 Category
 */
public class Category {

    private final int    categoryId;
    private String name;
    private String description;

    private static int idCounter = 1;

    public Category(String name, String description) {
        this.categoryId  = idCounter++;
        this.name        = name;
        this.description = description;
    }

    public int    getCategoryId()  { return categoryId; }
    public String getName()        { return name; }
    public String getDescription() { return description; }

    public void setName(String name)               { this.name = name; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public String toString() {
        return String.format("Category{id=%d, name='%s'}", categoryId, name);
    }
}
