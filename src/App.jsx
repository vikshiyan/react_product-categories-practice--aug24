/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getUserById(ownerId) {
  return usersFromServer.find(user => ownerId === user.id) || null;
}

function getCategory(categoryId) {
  return categoriesFromServer.find(category => categoryId === category.id);
}

const products = productsFromServer.map(product => {
  const category = getCategory(product.categoryId);
  const user = getUserById(category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const DEFAULT_VALUE = 'all';
  const VALUE_TOPICS = ['ID', 'Product', 'Category', 'User'];
  const getVisibleProduct = (
    productsList,
    { selected, nameFilter, selectedCategory },
  ) => {
    let filteredProduct = [...productsList];

    if (selected !== DEFAULT_VALUE) {
      filteredProduct = filteredProduct.filter(
        product => product.user.name === selected,
      );
    }

    const normalizedNameFilter = nameFilter.toLowerCase().trim();

    if (normalizedNameFilter) {
      filteredProduct = filteredProduct.filter(product => {
        const normalizedName = product.name.toLowerCase().trim();

        return normalizedName.includes(normalizedNameFilter);
      });
    }

    if (selectedCategory !== DEFAULT_VALUE) {
      filteredProduct = filteredProduct.filter(
        product => product.category.title === selectedCategory,
      );
    }

    return filteredProduct;
  };

  const [selected, setSelected] = useState(DEFAULT_VALUE);
  const [nameFilter, setNameFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_VALUE);
  const visibleProduct = getVisibleProduct(products, {
    selected,
    nameFilter,
    selectedCategory,
  });

  const handleClearFilters = () => {
    setNameFilter('');
  };

  const handleResetFilters = () => {
    setNameFilter('');
    setSelected(DEFAULT_VALUE);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelected(DEFAULT_VALUE)}
                className={selected === DEFAULT_VALUE ? 'is-active' : ''}
              >
                All
              </a>

              {usersFromServer.map(person => {
                return (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    key={person.id}
                    className={selected === person.name ? 'is-active' : ''}
                    onClick={() => setSelected(person.name)}
                  >
                    {person.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={nameFilter}
                  onChange={event =>
                    setNameFilter(event.target.value.trimStart())
                  }
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {nameFilter.length !== 0 && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleClearFilters}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': selectedCategory !== DEFAULT_VALUE,
                })}
                onClick={() => setSelectedCategory(DEFAULT_VALUE)}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedCategory === category.title,
                  })}
                  href="#/"
                  onClick={() => setSelectedCategory(category.title)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                {VALUE_TOPICS.map(topic => (
                  <th key={topic}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      {topic}
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {visibleProduct.length !== 0 ? (
              <tbody>
                {visibleProduct.map(product => {
                  return (
                    <tr data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">
                        {`${product.category.icon} - ${product.category.title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={
                          product.user.sex === 'm'
                            ? 'has-text-link'
                            : 'has-text-danger'
                        }
                      >
                        {product.user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
