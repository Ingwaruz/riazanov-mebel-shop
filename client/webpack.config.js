const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    // Optimization settings
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: 10,
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'all',
                    priority: 5,
                    reuseExistingChunk: true,
                },
                // Отдельный чанк для React
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: 'react',
                    chunks: 'all',
                    priority: 20,
                },
                // Отдельный чанк для UI библиотек
                ui: {
                    test: /[\\/]node_modules[\\/](bootstrap|react-bootstrap|mdb-react-ui-kit)[\\/]/,
                    name: 'ui',
                    chunks: 'all',
                    priority: 15,
                },
                // Отдельный чанк для утилит
                utils: {
                    test: /[\\/]node_modules[\\/](axios|lodash|moment)[\\/]/,
                    name: 'utils',
                    chunks: 'all',
                    priority: 12,
                }
            }
        },
        // Минимизация CSS и JS
        minimize: true,
        // Настройка имен чанков
        chunkIds: 'named',
        moduleIds: 'named',
    },
    
    // Resolve настройки
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@shared': path.resolve(__dirname, 'src/shared'),
            '@entities': path.resolve(__dirname, 'src/entities'),
            '@features': path.resolve(__dirname, 'src/features'),
            '@widgets': path.resolve(__dirname, 'src/widgets'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@app': path.resolve(__dirname, 'src/app'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    
    // Plugins
    plugins: [
        // Gzip compression
        new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 8192,
            minRatio: 0.8,
        }),
        
        // Brotli compression (better than gzip)
        new CompressionPlugin({
            filename: '[path][base].br',
            algorithm: 'brotliCompress',
            test: /\.(js|css|html|svg)$/,
            compressionOptions: {
                level: 11,
            },
            threshold: 8192,
            minRatio: 0.8,
        }),
        
        // Bundle Analyzer (только для анализа)
        // new BundleAnalyzerPlugin(),
        
        // Environment variables
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
    ],
    
    // Module rules
    module: {
        rules: [
            // Babel loader с кешированием
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    browsers: ['last 2 versions', 'ie >= 11']
                                },
                                modules: false, // Сохраняем ES6 модули для tree shaking
                                useBuiltIns: 'usage',
                                corejs: 3
                            }],
                            '@babel/preset-react'
                        ],
                        plugins: [
                            // Поддержка dynamic imports
                            '@babel/plugin-syntax-dynamic-import',
                            // Оптимизация React компонентов
                            ['@babel/plugin-transform-runtime', {
                                corejs: false,
                                helpers: true,
                                regenerator: true,
                                useESModules: false
                            }],
                        ]
                    }
                }
            },
            
            // CSS/SCSS обработка
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]___[hash:base64:5]'
                            },
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ['autoprefixer', {}],
                                    ['cssnano', { preset: 'default' }] // Минификация CSS
                                ]
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            
            // Обработка изображений
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024, // 8kb
                    },
                },
                generator: {
                    filename: 'images/[name].[hash][ext]',
                },
            },
            
            // Шрифты
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[hash][ext]',
                },
            },
        ]
    },
    
    // Performance hints
    performance: {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
    
    // Development server настройки
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        hot: true,
        historyApiFallback: true,
    },
    
    // Source maps для development
    devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'source-map',
}; 