import React from 'react';
import '../styles/CategoryList.css';

const categories = [
  {
    name: 'Mathematics',
    items: ['Algebra', 'Calculus', 'Geometry', 'Linear Algebra', 'Statistics']
  },
  {
    name: 'Science',
    items: ['Physics', 'Chemistry', 'Biology', 'Astronomy']
  },
  {
    name: 'Engineering',
    items: ['Electrical', 'Mechanical', 'Civil', 'Computer Science']
  },
  {
    name: 'Data Analysis',
    items: ['Data Visualization', 'Machine Learning', 'Time Series Analysis']
  }
];

const CategoryList: React.FC = () => {
  return (
    <div className="categories">
      {categories.map((category) => (
        <div key={category.name} className="category">
          <h2>{category.name}</h2>
          <ul>
            {category.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;