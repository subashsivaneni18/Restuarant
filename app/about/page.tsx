"use client";
import React from "react";
import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12 font-['raleway']">
      <div className="max-w-5xl mx-auto">
        {/* Restaurant Branding Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-red-600 mb-4 animate-fade-in">
            Quick Bite
          </h1>
          <p className="text-xl text-gray-600">
            Revolutionizing your dining experience with effortless ordering.
          </p>
        </section>

        {/* Restaurant Description */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-4 border-l-4 border-red-500 pl-4">
            About Our Restaurant
          </h2>
          <p className="text-lg leading-relaxed text-gray-700">
            At <strong>Quick Bite</strong>, we blend the finest culinary
            traditions from around the globe with cutting-edge technology. Our
            seamless dining experience allows you to explore a diverse range of
            flavors—from the spicy and aromatic dishes of India, to the rich and
            comforting pastas of Italy, to the bold and zesty flavors of Mexico,
            and the refined and delicate tastes of Japan. With just a scan of a
            QR code, you can immerse yourself in the world of gourmet dining,
            all from the comfort of your table.
          </p>
        </section>

        {/* Cuisine Sections */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-center text-green-500">
            Discover Our Cuisines
          </h2>

          {/* Indian Cuisine */}
          <div className="flex flex-col md:flex-row items-center mb-12">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <Image
                src="/images/indian.jpg" // Replace with the image URL of Indian cuisine
                alt="Indian Cuisine"
                width={600}
                height={400}
                className="rounded-xl shadow-lg object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 pl-0 md:pl-12">
              <h3 className="text-2xl font-semibold text-red-600 mb-4">
                Authentic Indian Cuisine
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Dive into the vibrant world of Indian cuisine. From rich, creamy
                butter chicken to spicy biryanis, we bring the best of India’s
                diverse culinary traditions right to your table. Experience the
                bold spices and intricate flavors that make Indian food so
                beloved worldwide.
              </p>
            </div>
          </div>

          {/* Italian Cuisine */}
          <div className="flex flex-col md:flex-row items-center mb-12">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <Image
                src="/images/italian.jpg" // Replace with the image URL of Italian cuisine
                alt="Italian Cuisine"
                width={600}
                height={400}
                className="rounded-xl shadow-lg object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 pl-0 md:pl-12">
              <h3 className="text-2xl font-semibold text-red-600 mb-4">
                Classic Italian Cuisine
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Indulge in the simplicity and elegance of Italian food. Savor
                the flavors of wood-fired pizza, creamy pastas, and fresh
                salads, all prepared with the finest ingredients. Our Italian
                dishes bring a piece of Italy right to your plate, inviting you
                to experience la dolce vita.
              </p>
            </div>
          </div>

          {/* Mexican Cuisine */}
          <div className="flex flex-col md:flex-row items-center mb-12">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <Image
                src="/images/mexican.jpg" // Replace with the image URL of Mexican cuisine
                alt="Mexican Cuisine"
                width={600}
                height={400}
                className="rounded-xl shadow-lg object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 pl-0 md:pl-12">
              <h3 className="text-2xl font-semibold text-red-600 mb-4">
                Bold Mexican Flavors
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Get ready for a fiesta of flavors with our Mexican dishes. From
                sizzling fajitas to soft tacos and creamy guacamole, our menu
                offers the bold spices and zesty flavors that make Mexican
                cuisine a crowd favorite. Let every bite transport you to the
                heart of Mexico.
              </p>
            </div>
          </div>

          {/* Japanese Cuisine */}
          <div className="flex flex-col md:flex-row items-center mb-12">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <Image
                src="/images/japanese.jpg" // Replace with the image URL of Japanese cuisine
                alt="Japanese Cuisine"
                width={600}
                height={400}
                className="rounded-xl shadow-lg object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 pl-0 md:pl-12">
              <h3 className="text-2xl font-semibold text-red-600 mb-4">
                Fresh Japanese Cuisine
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Experience the elegance and freshness of Japanese cuisine. Our
                sushi rolls, sashimi, and tempura are prepared with precision
                and the finest ingredients, offering a delicate balance of
                flavors. Each dish is a masterpiece that brings the art of
                Japanese cooking to your table.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
