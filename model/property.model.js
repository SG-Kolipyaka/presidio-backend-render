const mongoose = require("mongoose");

const PropertySchema = mongoose.Schema({
    place: { type: String, required: true },
    area: { type: String, required: true },
    housetype: { type: String, enum: ["Flat", "Bungalow", "Row House"], required: true },
    no_bedrooms: { type: Number, required: true },
    no_bathrooms: { type: Number, required: true },
    area_size: { type: String, required: true },
    nearby_railwaystation: { type: String, required: true },
    nearby_Hospital: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    user:{ type: String, required: true },
    userId:{ type: String, required: true },
    like:{ type: Number, required: true }
}, {
    versionKey: false
});

const PropertyModel = mongoose.model("post", PropertySchema);

module.exports = {
    PropertyModel
};
