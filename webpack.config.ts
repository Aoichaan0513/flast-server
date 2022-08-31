import { resolve } from 'path';
import { Configuration } from 'webpack';

export const BaseConfig: Configuration = {
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: ['.js', '.ts', '.json']
    },
    output: {
        path: resolve(__dirname, 'build'),
        publicPath: './',
        filename: '[name].js',
        assetModuleFilename: 'assets/[name][ext]'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{ loader: 'ts-loader' }]
            },
            {
                test: /\.(bmp|ico|gif|jpe?g|png|svg|ttf|eot|woff?2?)$/,
                type: 'asset/resource'
            }
        ]
    },
    externals: {
        bcrypt: 'require("bcrypt")',
        fs: 'require("fs")',
        keytar: 'require("keytar")',
        os: 'require("os")',
        path: 'require("path")'
    },
    devtool: 'inline-source-map'
};

export const Main: Configuration = {
    ...BaseConfig,
    mode: 'development',
    target: 'node',
    entry: {
        main: './src/main.ts'
    }
};

export default [Main];
