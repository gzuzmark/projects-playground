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
      <div className='card item'>
        <button type='button' className='icon-button' tabIndex='0'>
          <span className='button-holder'>
            <i aria-hidden='true'>
              <img
                className='icon-0-2-181 icon'
                src='https://images.pluto.tv/maincategory/618da8b51add6600071d686b/svgImageUrl-1636780391296.svg'
                alt='Pluto TV'
              />
            </i>
            <span className='text-holder'>Pluto TV</span>
          </span>
        </button>
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
    <div className='app-container'>
      <header>
        <div className='container'>
          <span>Welcome to the </span>
          <img
            src={plutoLogo}
            style={{ backgroundColor: 'black' }}
            alt='pluto-logo'
          />
          <span> code challenge!</span>
        </div>
      </header>
      <div className='content-container'>
        <section className='categories-container categories '>
          <h2>Categories</h2>
          <ul className='list'>
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
        <section className='channels-container channels'>
          <h2>Channel</h2>
          <ul className='list'>
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
