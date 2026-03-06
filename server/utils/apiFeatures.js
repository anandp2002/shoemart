class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // Text search
    search() {
        const keyword = this.queryStr.keyword
            ? {
                $or: [
                    { name: { $regex: this.queryStr.keyword, $options: 'i' } },
                    { brand: { $regex: this.queryStr.keyword, $options: 'i' } },
                    { description: { $regex: this.queryStr.keyword, $options: 'i' } },
                ],
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    // Field-based filtering
    filter() {
        const queryCopy = { ...this.queryStr };

        // Remove fields used for other purposes
        const removeFields = ['keyword', 'page', 'limit', 'sort', 'fields'];
        removeFields.forEach((field) => delete queryCopy[field]);

        // Handle price range
        if (queryCopy.minPrice || queryCopy.maxPrice) {
            queryCopy.price = {};
            if (queryCopy.minPrice) {
                queryCopy.price.$gte = Number(queryCopy.minPrice);
                delete queryCopy.minPrice;
            }
            if (queryCopy.maxPrice) {
                queryCopy.price.$lte = Number(queryCopy.maxPrice);
                delete queryCopy.maxPrice;
            }
        }

        // Handle size filter
        if (queryCopy.size) {
            queryCopy['sizes.size'] = Number(queryCopy.size);
            queryCopy['sizes.stock'] = { $gt: 0 };
            delete queryCopy.size;
        }

        // Only show active products by default
        if (!queryCopy.hasOwnProperty('isActive')) {
            queryCopy.isActive = true;
        }

        this.query = this.query.find(queryCopy);
        return this;
    }

    // Sort
    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    // Paginate
    paginate(resultsPerPage = 12) {
        const page = Number(this.queryStr.page) || 1;
        const limit = Number(this.queryStr.limit) || resultsPerPage;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        this.page = page;
        this.limit = limit;
        return this;
    }
}

export default ApiFeatures;
