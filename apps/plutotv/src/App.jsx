import { useState, useMemo } from 'react';
import reactLogo from './assets/react.svg';
import plutoLogo from './assets/logo.svg';
import { useCategories } from './api/useCategories';
import { useChannels } from './api/useChannels';
import './App.css';

const defaultCategory = '5c12fe491cbd932b678e3d84';

function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

const Category = ({ category, setFilter, setFavorites, favorites }) => {
  const { url } = category.images.pngImage;
  const filterHandler = () => {
    setFilter(category.id);
  };

  const favoriteHandler = () => {
    setFavorites((previousfavorites) => [...previousfavorites, category.id]);
  };

  // const onImageError = (e) => {
  //   e.onerror=null;
  //   e.target.src = placeholderImage;
  //   e.target.alt = "this is a fallback image"
  // }
  return (
    <div className='cards-container' id={`category-${category.id}`}>
      <div className='card'>
        <img
          alt='category icon'
          src={url}
          // onError="this.onerror=null; this.src='vite.svg'"1
        />
        <div
          className='container'
          onClick={filterHandler}
          onKeyUp={filterHandler}
          role='button'
          tabIndex={0}
        >
          {category.name}
        </div>
        <div
          className={classNames(
            'category__favorite-btn',
            favorites?.find((fav) => fav === category.id) &&
              'category__favorite-btn--active'
          )}
          onClick={favoriteHandler}
          onKeyUp={favoriteHandler}
          role='button'
          tabIndex={0}
        >
          Favorite
        </div>
      </div>
    </div>
  );
};

function App() {
  const [selectedCategory, setselectedCategory] = useState(defaultCategory);
  const [favorites, setFavorites] = useState([]);

  const categories = useCategories();
  console.log(categories.filter((f) => f.id === '5c12fe491cbd932b678e3d84'));
  const channels = useChannels();

  const filteredChannels = useMemo(() => {
    const resultChannels = channels
      .filter((ch) => ch.categoryID === selectedCategory)
      .sort((a, b) => b.sort - a.sort);
    console.log({ resultChannels });
    return resultChannels;
  }, [selectedCategory, channels]);

  const onClickCategory = (id) => {
    console.log({ id });
    setselectedCategory(id);
  };

  return (
    <div className='App'>
      <header>
        <span>Welcome to the </span>
        <img
          src={plutoLogo}
          style={{ backgroundColor: 'black' }}
          alt='pluto-logo'
        />
        <span> code challenge!</span>
      </header>
      <div className='app-container'>
        <section className='content-container categories '>
          <h2>Categories</h2>
          <ul className='category-list'>
            {categories.slice(0, 20).map((cat) => (
              <Category
                category={cat}
                setFilter={onClickCategory}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            ))}
          </ul>
        </section>
        <section className='content-container channels'>
          <h2>Channel</h2>
          <ul>
            {filteredChannels.length ? (
              filteredChannels.map((ch) => (
                <li id={`channel-${ch.id}`}>{ch.name}</li>
              ))
            ) : (
              <p>No channels to show</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;
