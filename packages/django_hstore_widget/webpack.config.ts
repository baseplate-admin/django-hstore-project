import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Configuration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import TerserPlugin from 'terser-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendSourceDir = resolve(__dirname, 'src', 'frontend');
const isProduction = process.env.NODE_ENV === 'production';

export default (): Configuration & { devServer?: DevServerConfiguration } => {
    return {
        mode: isProduction ? 'production' : 'development',
        entry: './src/frontend/index.ts',
        output: {
            path: resolve(__dirname, 'dist', 'components'),
            filename: 'django-hstore-widget.js',
            clean: true,
        },
        resolve: {
            extensions: ['.ts', '.js'],
            plugins: [new TsconfigPathsPlugin({})],
        },
        optimization: {
            minimize: isProduction,
            minimizer: isProduction
                ? [
                      new TerserPlugin({
                          extractComments: false,
                          terserOptions: {
                              compress: {
                                  drop_console: true,
                                  passes: 3,
                                  unused: true,
                              },
                              format: {
                                  comments: false,
                                  ascii_only: true,
                                  beautify: false,
                              },
                          },
                      }),
                  ]
                : [],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            configFile: resolve(__dirname, 'babel.config.ts'),
                            generatorOpts: {
                                compact: true,
                            },
                        },
                    },
                },
                {
                    test: /\.css$/,
                    type: 'javascript/auto',
                    use: [
                        'raw-loader',
                        isProduction ? resolve(__dirname, 'webpack-plugins/minify-css-loader.ts') : undefined,
                    ].filter(Boolean),
                },
            ],
        },
        devServer: {
            static: {
                directory: frontendSourceDir,
            },
            port: 9100,
            hot: true,
            devMiddleware: {
                writeToDisk: true,
            },
        },
    };
};
