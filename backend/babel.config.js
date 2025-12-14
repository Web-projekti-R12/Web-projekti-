// babel.config.js (HUOM: Pitää olla JavaScript-muodossa)
export default {
    presets: [
        // Tämä tekee työn: muuntaa "import" ja "export" lauseet
        ['@babel/preset-env', {
            // TÄRKEÄÄ: Määritellään, että moduulit muunnetaan CommonJS-muotoon (jonka Jest ymmärtää)
            targets: {
                node: 'current',
            },
            modules: 'commonjs', 
        }],
    ],
};