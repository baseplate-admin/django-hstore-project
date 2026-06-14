import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import TerserPlugin from 'terser-webpack-plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendSourceDir = resolve(__dirname, 'src', 'frontend');

export default (env, argv) => {
    const isProduction = argv.mode === 'production';

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
            alias: {
                $lib: resolve(frontendSourceDir, 'lib'),
                $store: resolve(frontendSourceDir, 'stores'),
                $mappping: resolve(frontendSourceDir, 'mappings'),
                $components: resolve(frontendSourceDir, 'components'),
            },
        },
        optimization: {
            minimize: isProduction,
            minimizer: isProduction
                ? [
                      new TerserPlugin({
                          terserOptions: {
                              compress: {
                                  drop_console: true,
                                  passes: 3,
                                  unused: true,
                              },
                              mangle: {
                                  safari10: true,
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
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                },
                {
                    test: /\.css$/,
                    type: 'javascript/auto',
                    use: 'raw-loader',
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
