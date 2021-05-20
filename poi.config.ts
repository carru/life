import { Config } from 'poi'

const config: Config = {
    output: {
        publicUrl: '.'
    },
    configureWebpack: {
        module: {
            rules: [{
                test: /\.(frag|vert|glsl)$/,
                use: [
                    {
                        // loader: 'glsl-shader-loader',
                        loader: 'webpack-glsl-loader',
                        options: {}
                    }
                ]
            }]
        }
    }
}

export default config