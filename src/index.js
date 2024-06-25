    import { registerBlockType } from '@wordpress/blocks';
    // import { useBlockProps } from '@wordpress/block-editor';
    import Edit from './edit';
    import './style.css';

    registerBlockType('biblio/bestseller', {
        apiVersion: 2,
        title: 'Biblio Bestseller Block',
        description: 'A block displaying the bestselling book for the selected genre',
        icon: 'book',
        category: 'widgets',
        attributes: {
            title: {
                type: 'string',
                default: 'Bestsellers'
            },
            genre: {
                type: 'object',
                default: {}
            },
            bookData: {
                type: 'object',
                default: {}
            }
        },
        edit: Edit,
        save: () => {
            //const blockProps = useBlockProps.save();
            return null; // Rendered in PHP
        }
    });
