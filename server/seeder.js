import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();

const categories = [
    { name: 'Sneakers', description: 'Casual and trendy sneakers for everyday wear', image: { public_id: 'cat_sneakers', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800' } },
    { name: 'Running', description: 'High-performance running shoes', image: { public_id: 'cat_running', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800' } },
    { name: 'Formal', description: 'Elegant formal shoes for office and events', image: { public_id: 'cat_formal', url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800' } },
    { name: 'Sports', description: 'Athletic shoes for various sports', image: { public_id: 'cat_sports', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' } },
    { name: 'Sandals', description: 'Comfortable sandals and slides', image: { public_id: 'cat_sandals', url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800' } },
    { name: 'Boots', description: 'Stylish boots for all seasons', image: { public_id: 'cat_boots', url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800' } },
];

const getProducts = (categoryMap) => [
    {
        name: 'Nike Air Max 270',
        description: 'The Nike Air Max 270 features Nike\'s biggest heel Air unit yet for a super soft ride. The stretchy inner sleeve delivers a snug fit, and its heritage look goes with everything.',
        price: 8995,
        mrp: 12995,
        brand: 'Nike',
        category: categoryMap['Sneakers'],
        sizes: [
            { size: 6, stock: 10 }, { size: 7, stock: 15 }, { size: 8, stock: 20 },
            { size: 9, stock: 18 }, { size: 10, stock: 12 }, { size: 11, stock: 8 },
        ],
        color: 'Black/White',
        gender: 'men',
        featured: true,
        images: [{ public_id: 'sample_1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' }],
    },
    {
        name: 'Adidas Ultraboost 23',
        description: 'Experience epic energy with the Ultraboost 23 running shoes. They have a BOOST midsole for responsive cushioning and a Stretchweb outsole with Continental Rubber.',
        price: 11999,
        mrp: 16999,
        brand: 'Adidas',
        category: categoryMap['Running'],
        sizes: [
            { size: 7, stock: 12 }, { size: 8, stock: 20 }, { size: 9, stock: 15 },
            { size: 10, stock: 10 }, { size: 11, stock: 8 },
        ],
        color: 'Core Black',
        gender: 'men',
        featured: true,
        images: [{ public_id: 'sample_2', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800' }],
    },
    {
        name: 'Puma RS-X³ Puzzle',
        description: 'The RS-X³ Puzzle sneaker blends retro style with futuristic vibes. Bold color blocking and chunky midsole make this a standout shoe.',
        price: 6999,
        mrp: 9999,
        brand: 'Puma',
        category: categoryMap['Sneakers'],
        sizes: [
            { size: 6, stock: 15 }, { size: 7, stock: 20 }, { size: 8, stock: 25 },
            { size: 9, stock: 20 }, { size: 10, stock: 15 },
        ],
        color: 'White/Blue',
        gender: 'unisex',
        featured: true,
        images: [{ public_id: 'sample_3', url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800' }],
    },
    {
        name: 'Nike Revolution 6',
        description: 'The Nike Revolution 6 is designed for road running with a lightweight feel and responsive cushioning for an incredibly smooth ride.',
        price: 3695,
        mrp: 4995,
        brand: 'Nike',
        category: categoryMap['Running'],
        sizes: [
            { size: 6, stock: 25 }, { size: 7, stock: 30 }, { size: 8, stock: 30 },
            { size: 9, stock: 25 }, { size: 10, stock: 20 }, { size: 11, stock: 15 },
        ],
        color: 'Black/Dark Smoke Grey',
        gender: 'men',
        featured: false,
        images: [{ public_id: 'sample_4', url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800' }],
    },
    {
        name: 'Woodland Formal Oxford',
        description: 'Premium leather Oxford shoes with a classic design. Perfect for formal occasions and office wear with superior comfort.',
        price: 4495,
        mrp: 5995,
        brand: 'Woodland',
        category: categoryMap['Formal'],
        sizes: [
            { size: 7, stock: 10 }, { size: 8, stock: 15 }, { size: 9, stock: 12 },
            { size: 10, stock: 10 }, { size: 11, stock: 8 },
        ],
        color: 'Brown',
        gender: 'men',
        featured: false,
        images: [{ public_id: 'sample_5', url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800' }],
    },
    {
        name: 'Nike Air Force 1 \'07',
        description: 'The radiance lives on in the Nike Air Force 1 \'07 with crispy leather, bold colors, and the perfect amount of flash to make you shine.',
        price: 7495,
        mrp: 8195,
        brand: 'Nike',
        category: categoryMap['Sneakers'],
        sizes: [
            { size: 5, stock: 10 }, { size: 6, stock: 20 }, { size: 7, stock: 25 },
            { size: 8, stock: 30 }, { size: 9, stock: 20 }, { size: 10, stock: 15 },
        ],
        color: 'Triple White',
        gender: 'unisex',
        featured: true,
        images: [{ public_id: 'sample_6', url: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800' }],
    },
    {
        name: 'Adidas Stan Smith',
        description: 'Originally made for tennis, the adidas Stan Smith shoes now have legendary street style. Clean lines and a low profile make them icons.',
        price: 5999,
        mrp: 7999,
        brand: 'Adidas',
        category: categoryMap['Sneakers'],
        sizes: [
            { size: 4, stock: 10 }, { size: 5, stock: 15 }, { size: 6, stock: 20 },
            { size: 7, stock: 18 }, { size: 8, stock: 15 },
        ],
        color: 'White/Green',
        gender: 'women',
        featured: true,
        images: [{ public_id: 'sample_7', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800' }],
    },
    {
        name: 'New Balance 574',
        description: 'The 574 is the classic New Balance icon. Its combination of comfort and style has made it one of the most iconic shoes in the world.',
        price: 6295,
        mrp: 8995,
        brand: 'New Balance',
        category: categoryMap['Sneakers'],
        sizes: [
            { size: 6, stock: 12 }, { size: 7, stock: 18 }, { size: 8, stock: 22 },
            { size: 9, stock: 18 }, { size: 10, stock: 14 },
        ],
        color: 'Grey/Navy',
        gender: 'men',
        featured: false,
        images: [{ public_id: 'sample_8', url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800' }],
    },
    {
        name: 'Reebok Classic Leather',
        description: 'Clean, classic, and built for comfort. The Reebok Classic Leather features soft leather upper and a cushioned midsole for all-day comfort.',
        price: 4999,
        mrp: 6999,
        brand: 'Reebok',
        category: categoryMap['Sneakers'],
        sizes: [
            { size: 6, stock: 14 }, { size: 7, stock: 20 }, { size: 8, stock: 18 },
            { size: 9, stock: 16 }, { size: 10, stock: 12 },
        ],
        color: 'White/Gum',
        gender: 'unisex',
        featured: false,
        images: [{ public_id: 'sample_9', url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800' }],
    },
    {
        name: 'Nike Pegasus 40',
        description: 'A springy ride for everyday road running. The Pegasus 40 has responsive cushioning and a breathable mesh upper for incredible comfort.',
        price: 9495,
        mrp: 11895,
        brand: 'Nike',
        category: categoryMap['Running'],
        sizes: [
            { size: 7, stock: 15 }, { size: 8, stock: 20 }, { size: 9, stock: 18 },
            { size: 10, stock: 12 }, { size: 11, stock: 10 },
        ],
        color: 'White/Volt',
        gender: 'men',
        featured: true,
        images: [{ public_id: 'sample_10', url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800' }],
    },
    {
        name: 'Adidas Slides Adilette',
        description: 'These iconic adidas slides are perfect for poolside lounging or post-workout recovery. Contoured footbed for cushioned comfort.',
        price: 1999,
        mrp: 2799,
        brand: 'Adidas',
        category: categoryMap['Sandals'],
        sizes: [
            { size: 6, stock: 30 }, { size: 7, stock: 35 }, { size: 8, stock: 40 },
            { size: 9, stock: 30 }, { size: 10, stock: 25 },
        ],
        color: 'Black/White',
        gender: 'unisex',
        featured: false,
        images: [{ public_id: 'sample_11', url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800' }],
    },
    {
        name: 'Timberland 6-Inch Premium Boot',
        description: 'The original Timberland boot. Made with premium waterproof leather and seam-sealed construction for dry comfort in any weather.',
        price: 12999,
        mrp: 16999,
        brand: 'Timberland',
        category: categoryMap['Boots'],
        sizes: [
            { size: 7, stock: 8 }, { size: 8, stock: 12 }, { size: 9, stock: 10 },
            { size: 10, stock: 8 }, { size: 11, stock: 6 },
        ],
        color: 'Wheat Nubuck',
        gender: 'men',
        featured: true,
        images: [{ public_id: 'sample_12', url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800' }],
    },
    {
        name: 'Skechers Go Walk 6',
        description: 'Lightweight and extremely comfortable walking shoe with Skechers Air-Cooled Goga Mat insole. Perfect for all-day wear.',
        price: 3999,
        mrp: 5499,
        brand: 'Skechers',
        category: categoryMap['Sports'],
        sizes: [
            { size: 5, stock: 15 }, { size: 6, stock: 20 }, { size: 7, stock: 25 },
            { size: 8, stock: 20 },
        ],
        color: 'Black',
        gender: 'women',
        featured: false,
        images: [{ public_id: 'sample_13', url: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800' }],
    },
    {
        name: 'Nike Air Jordan 1 Mid',
        description: 'Inspired by the original AJ1, this mid-top edition maintains the iconic look while adding comfort and durability for everyday wear.',
        price: 10795,
        mrp: 12795,
        brand: 'Nike',
        category: categoryMap['Sneakers'],
        sizes: [
            { size: 7, stock: 10 }, { size: 8, stock: 15 }, { size: 9, stock: 12 },
            { size: 10, stock: 10 }, { size: 11, stock: 8 },
        ],
        color: 'Bred Toe',
        gender: 'men',
        featured: true,
        images: [{ public_id: 'sample_14', url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800' }],
    },
    {
        name: 'Converse Chuck Taylor All Star',
        description: 'The iconic Chuck Taylor All Star sneaker. Canvas upper, rubber toe cap, and the unmistakable All Star logo on the ankle patch.',
        price: 3499,
        mrp: 4499,
        brand: 'Converse',
        category: categoryMap['Sneakers'],
        sizes: [
            { size: 4, stock: 15 }, { size: 5, stock: 20 }, { size: 6, stock: 25 },
            { size: 7, stock: 25 }, { size: 8, stock: 20 }, { size: 9, stock: 15 },
        ],
        color: 'Black',
        gender: 'unisex',
        featured: false,
        images: [{ public_id: 'sample_15', url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800' }],
    },
    {
        name: 'Puma Soft Ride Enzo Evo',
        description: 'A stylish and comfortable running shoe with SoftFoam+ sockliner and SoftRide midsole for a plush and cushioned run.',
        price: 4999,
        mrp: 6999,
        brand: 'Puma',
        category: categoryMap['Running'],
        sizes: [
            { size: 5, stock: 12 }, { size: 6, stock: 18 }, { size: 7, stock: 22 },
            { size: 8, stock: 18 },
        ],
        color: 'Pink/White',
        gender: 'women',
        featured: false,
        images: [{ public_id: 'sample_16', url: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800' }],
    },
    {
        name: 'Nike Blazer Mid \'77 Vintage',
        description: 'In the \'70s, Nike was the new shoe on the block. Vintage vibes with exposed foam on the tongue and a worn-in Swoosh give this icon its retro look.',
        price: 7495,
        mrp: 8695,
        brand: 'Nike',
        category: categoryMap['Sneakers'],
        sizes: [
            { size: 6, stock: 10 }, { size: 7, stock: 15 }, { size: 8, stock: 18 },
            { size: 9, stock: 14 }, { size: 10, stock: 10 },
        ],
        color: 'White/Black',
        gender: 'unisex',
        featured: false,
        images: [{ public_id: 'sample_17', url: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800' }],
    },
    {
        name: 'Adidas Alphabounce+',
        description: 'Versatile training shoe with Bounce cushioning for high-energy returns. Forgedmesh upper adapts to your foot for a snug fit.',
        price: 5999,
        mrp: 8999,
        brand: 'Adidas',
        category: categoryMap['Sports'],
        sizes: [
            { size: 7, stock: 14 }, { size: 8, stock: 20 }, { size: 9, stock: 16 },
            { size: 10, stock: 12 }, { size: 11, stock: 10 },
        ],
        color: 'Cloud White',
        gender: 'men',
        featured: false,
        images: [{ public_id: 'sample_18', url: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800' }],
    },
    {
        name: 'Crocs Classic Clog',
        description: 'The iconic Classic Clog from Crocs offers lightweight Croslite foam construction and ventilation ports for breathability.',
        price: 2995,
        mrp: 3995,
        brand: 'Crocs',
        category: categoryMap['Sandals'],
        sizes: [
            { size: 5, stock: 20 }, { size: 6, stock: 25 }, { size: 7, stock: 30 },
            { size: 8, stock: 25 }, { size: 9, stock: 20 }, { size: 10, stock: 15 },
        ],
        color: 'Black',
        gender: 'unisex',
        featured: false,
        images: [{ public_id: 'sample_19', url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800' }],
    },
    {
        name: 'Nike Dunk Low Retro',
        description: 'Created for the hardwood but taken to the streets, the Nike Dunk Low Retro returns with crisp overlays and classic team colors.',
        price: 8695,
        mrp: 8695,
        brand: 'Nike',
        category: categoryMap['Sneakers'],
        sizes: [
            { size: 7, stock: 8 }, { size: 8, stock: 12 }, { size: 9, stock: 10 },
            { size: 10, stock: 8 },
        ],
        color: 'Panda',
        gender: 'unisex',
        featured: true,
        images: [{ public_id: 'sample_20', url: 'https://images.unsplash.com/photo-1612902456551-333ac5afa26e?w=800' }],
    },
];

const seedDB = async () => {
    try {
        await connectDB();
        console.log('📦 Seeding database...');

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin',
            email: 'admin@shoemart.com',
            password: 'admin123',
            role: 'admin',
            phone: '9999999999',
        });
        console.log('✅ Admin user created (admin@shoemart.com / admin123)');

        // Create test user
        await User.create({
            name: 'Test User',
            email: 'user@shoemart.com',
            password: 'user123',
            role: 'user',
            phone: '8888888888',
        });
        console.log('✅ Test user created (user@shoemart.com / user123)');

        // Create categories
        const createdCategories = await Category.create(categories);
        const categoryMap = {};
        createdCategories.forEach((cat) => {
            categoryMap[cat.name] = cat._id;
        });
        console.log(`✅ ${createdCategories.length} categories created`);

        // Create products
        const productData = getProducts(categoryMap);
        const createdProducts = await Product.create(productData);
        console.log(`✅ ${createdProducts.length} products created`);

        console.log('\n🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

// Run with: node seeder.js
// Clear with: node seeder.js -d
if (process.argv[2] === '-d') {
    const destroyData = async () => {
        try {
            await connectDB();
            await User.deleteMany();
            await Product.deleteMany();
            await Category.deleteMany();
            console.log('🗑️  All data destroyed!');
            process.exit(0);
        } catch (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }
    };
    destroyData();
} else {
    seedDB();
}
