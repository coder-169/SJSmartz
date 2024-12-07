"use client";
// packages
import { ChevronDown } from "lucide-react";

// layouts
import SectionLayout from "@/layouts/sectionLayout";

// ui
import Text from "@/ui/text";
import Heading from "@/ui/head";
import { DropdownIcon, SearchIcon } from "@/ui/assets/svg";

// ui
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

// lib
import { cn } from "@/lib/utils";
import CatalogToggle from "@/app/(subroot)/shop/catalogToggle";
import CatalogProduct from "@/app/(subroot)/shop/catalogProduct";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

const categories = [
  {
    value: "all",
    text: "All",
  },
  {
    value: "watches",
    text: "Watches",
  },
  {
    value: "headphones",
    text: "Headphones",
  },
];

const prices = [
  {
    value: "all",
    text: "All",
  },
  {
    value: "500-1500",
    text: "Rs.500 - Rs.1500",
  },
  {
    value: "1500-2500",
    text: "Rs.1500 - Rs.2500",
  },
  {
    value: "2500-5000",
    text: "Rs.2500 - Rs.5000",
  },
  {
    value: "5000+",
    text: "Rs.5000+",
  },
];

const sorts = [
  {
    value: "price-low-to-high",
    text: "Price Low to High",
  },
  {
    value: "price-high-to-low",
    text: "Price High to Low",
  },
  {
    value: "newest-products",
    text: "Newest Products",
  },
  {
    value: "best-ratings",
    text: "Best Ratings",
  },
  {
    value: "largest-discount",
    text: "Largest Discount",
  },
  {
    value: "most-reviews",
    text: "Most Reviews",
  },
  {
    value: "available-stock",
    text: "Available Stock",
  },
];
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { FaAngleDown, FaSadCry } from "react-icons/fa";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [price, setPrice] = useState('All')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('All')
  const sorting = (sort: { text: string, value: string }) => {
    setSort(sort.text)
    if (sort.text === 'Price Low to High') {
      const sortedProducts = products.sort((a: Product, b: Product) => a.variants[0].price - b.variants[0].price)
      setProducts([...sortedProducts])
    }
    if (sort.text === 'Price High to Low') {
      const sortedProducts = products.sort((a: Product, b: Product) => b.variants[0].price - a.variants[0].price)
      setProducts([...sortedProducts])
    }
    if (sort.text === 'Newest Products') {
      const sortedProducts = products.sort((a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setProducts([...sortedProducts])
    }
    if (sort.text === 'Best Ratings') {
      const sortedProducts = products.sort((a: Product, b: Product) => b.rating - a.rating)
      setProducts([...sortedProducts])
    }
    if (sort.text === 'Largest Discount') {
      const sortedProducts = products.sort((a: Product, b: Product) => b.variants[0].discount - a.variants[0].discount)
      setProducts([...sortedProducts])
    }
    if (sort.text === 'Most Reviews') {
      const sortedProducts = products.sort((a: Product, b: Product) => b.noOfReviews - a.noOfReviews)
      setProducts([...sortedProducts])
    }
    if (sort.text === 'Available Stock') {
      const sortedProducts = products.sort((a: Product, b: Product) => b.variants[0].stock - a.variants[0].stock)
      setProducts([...sortedProducts])
    }
    if (sort.text === 'Related Products') {
      setProducts(allProducts)
    }
  }
  const priceFilter = (price: { text: string, value: string }) => {
    setPrice(price.text)
    if (price.text === 'All') {
      if (category === 'All') return setProducts(allProducts)
     
      const newProducts = allProducts.filter((product: Product) => (product.category.toLowerCase().includes(category.toLowerCase())))
    
      return setProducts(newProducts)
    }

    // Split the price range
    const [minPrice, maxPrice] = price.value.split('-').map((p) => parseInt(p));

    if (category !== 'All') {

      const newProds = allProducts.filter((product: Product) => (product.category.toLowerCase().includes(category.toLowerCase())))
      // Filter products based on their price and variant prices
      const filteredProducts = newProds.filter((product: Product) => {
        // Check if the product's price falls within the range

        // Check if any variant's price falls within the range
        const isVariantInRange = product.variants.some(
          (variant) => variant.price >= minPrice && variant.price <= maxPrice
        );
        // Include the product if it or any of its variants match the criteria
        return isVariantInRange;
      });
      // Update the filtered products
      setProducts(filteredProducts);
    }
    else {

      // Filter products based on their price and variant prices
      const filteredProducts = allProducts.filter((product: Product) => {
        // Check if the product's price falls within the range

        // Check if any variant's price falls within the range
        const isVariantInRange = product.variants.some(
          (variant) => variant.price >= minPrice && variant.price <= maxPrice
        );

        // Include the product if it or any of its variants match the criteria
        return isVariantInRange;
      })
      // Update the filtered products
      setProducts(filteredProducts);
    }


  }

  const categoryFilter = (cat: { text: string, value: string }) => {
    setCategory(cat.text)
    if (cat.text === 'All') {
      if (price === 'All') return setProducts(allProducts)
      const cleanRange = price.replace(/Rs\./g, "").trim();

      // Step 2: Split the range into two values
      const [minPrice, maxPrice] = cleanRange.split("-").map((val) => parseInt(val.trim(), 10));
      const newProds = allProducts.filter((product: Product) => {
        // Check if the product's price falls within the range

        // Check if any variant's price falls within the range
        const isVariantInRange = product.variants.some(
          (variant) => variant.price >= minPrice && variant.price <= maxPrice
        );

        // Include the product if it or any of its variants match the criteria
        return isVariantInRange;
      });
      return setProducts(newProds)
    }

    if (price !== 'All') {
      const cleanRange = price.replace(/Rs\./g, "").trim();

      // Step 2: Split the range into two values
      const [minPrice, maxPrice] = cleanRange.split("-").map((val) => parseInt(val.trim(), 10));

      const newProds = allProducts.filter((product: Product) => {
        // Check if the product's price falls within the range

        // Check if any variant's price falls within the range
        const isVariantInRange = product.variants.some(
          (variant) => variant.price >= minPrice && variant.price <= maxPrice
        );

        // Include the product if it or any of its variants match the criteria
        return isVariantInRange;
      });

      const filterProds = newProds.filter((product: Product) => (product.category.toLowerCase() === cat.value.toLowerCase()))
      setProducts(filterProds)
    } else {
      const filterProds = allProducts.filter((product: Product) => (product.category.toLowerCase().includes(cat.value.toLowerCase())))
      setProducts(filterProds)
    }

  }
  const [query, setQuery] = useState('')
  const resetFilters = () => {
    setQuery('')
    setCategory('All')
    setPrice('All')
    setSort('All')
    setProducts(allProducts)
  }
  const filterQuery = (e: { target: { value: string } }) => {
    setQuery(e.target.value)
    const filteredProducts = allProducts.filter((product: Product) => {
      return product.title.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setProducts(filteredProducts)
  }
  const [loading, setLoading] = useState(true);
  const getProducts = async () => {
    setLoading(true)
    await fetch("/api/user/product")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setAllProducts(data.products)
      });
    setLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <SectionLayout>
      {loading ? <Loader /> : <div className="px-4 md:px-8 py-4">
        <div className="relative flex h-[300px] flex-col items-center justify-center gap-4 bg-[#F3F5F7] text-center">
          <div className="flex items-center gap-4">
            <Text
              size="sm"
              color="gray"
              weight={500}
              className="flex items-center gap-1"
            >
              Home{" "}
              <DropdownIcon stroke="#6C7275" className="h-3 w-3 -rotate-90" />
            </Text>
            <Text size="sm" weight={500}>
              Shop
            </Text>
          </div>
          <Heading as="h1" intent="shop-page">
            Shop Page
          </Heading>
          <Text className="lg:text-lg">
            Good Sounds make the Environment. Great Sounds heal the Soul!
            <br />
            Sj Smartz.
          </Text>
        </div>

        <div className="grid gap-8 py-8 lg:grid-cols-[2fr_1fr_3fr] lg:items-end lg:gap-4">
          {/* filter select menu */}
          <div className="flex gap-4 lg:col-span-1 lg:items-center lg:gap-4">

            <div className="w-full space-y-2">
              <Text size="sm" weight={600} color="gray" transform="uppercase">
                Categories
              </Text>
              <Menu as="div" className="text-left w-full relative inline-block">
                <div>
                  <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white p-3 text-sm font-semibold text-gray-900 shadow-sm border border-[#141718] hover:bg-gray-50">
                    {category}
                    <FaAngleDown aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="w-full absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in   border border-[#141718]"
                >
                  <div className="py-1">
                    {categories.map(category => {
                      return <MenuItem key={category.value}>
                        <button
                          onClick={() => categoryFilter(category)}
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none w-full"
                        >
                          {category.text}
                        </button>
                      </MenuItem>
                    })}
                  </div>
                </MenuItems>
              </Menu>
            </div>
            <div className="w-full space-y-2">
              <Text size="sm" weight={600} color="gray" transform="uppercase">
                price
              </Text>
              <Menu as="div" className="text-left w-full relative inline-block">
                <div>
                  <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white p-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50  border border-[#141718]" >
                    {price}
                    <FaAngleDown aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="w-full absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg  transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    {prices.map(price => {
                      return <MenuItem key={price.value}>
                        <button
                          onClick={() => priceFilter(price)}
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none w-full"
                        >
                          {price.text}
                        </button>
                      </MenuItem>
                    })}
                  </div>
                </MenuItems>
              </Menu>
            </div>
          </div>

          <div className="block md:space-y-0 space-y-4 md:flex gap-4 items-center justify-between  py-2 lg:col-start-3 lg:justify-end lg:gap-8 lg:border-y-0 lg:py-0">
            {/* sort by */}
            <div className="w-full md:w-2/3 flex h-12 items-center gap-2 rounded-md border border-[#141718] px-4">
              <label htmlFor="search" className="cursor-pointer">
                <SearchIcon />
              </label>
              <input
                id="search"
                name="search"
                value={query}
                onChange={filterQuery}
                className="font-inter w-full text-sm font-normal text-[#141718] outline-none placeholder:opacity-70"
                placeholder="Search"
              />
            </div>
            <Menu as="div" className="text-left w-1/2 relative inline-block">
              <div>
                <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white p-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 border border-[#141718]">
                  {sort}
                  <FaAngleDown aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="w-full absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <div className="py-1">
                  {sorts.map(sort => {
                    return <MenuItem key={sort.value}>
                      <button
                        onClick={() => sorting(sort)}
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none w-full"
                      >
                        {sort.text}
                      </button>
                    </MenuItem>
                  })}
                </div>
              </MenuItems>
            </Menu>
            <button onClick={resetFilters} className="ml-4 text-sm font-bold text-black/80 hover:text-black/50 transition-all duration-200">Reset</button>
          </div>
        </div>
        {/* {loading ? <Loader /> : <CatalogProduct products={products} />} */}
        {products.length > 0 ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 my-8 md:my-16 lg:my-24 justify-between gap-x-2 md:gap-x-4 md:gap-y-10 gap-y-6">
          {products.map((product, idx) => {
            return <ProductCard key={idx} product={product} />;
          })}
        </div> : <div className="h-[50vh] flex opacity-80 items-center flex-col justify-center">
          <h3 className="font-bold text-3xl mb-4 ">No Products </h3>
          <FaSadCry className="size-28" />
        </div>}
      </div>}
    </SectionLayout >
  );
}
