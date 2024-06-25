import React from 'react';  
import { useState, useEffect } from '@wordpress/element';
import Select from 'react-select';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import logo from './assets/logo.svg';

const Edit = ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps();
    const [genres, setGenres] = useState([]);
    const [bookData, setBookData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredGenres, setFilteredGenres] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const { baseUrl } = attributes;
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('https://vickeysen.com/plugin-files/data.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const data = await response.json();
                let updatedGenres = data.data.categories.map((g) => {
                    return { label: g.menuText, description: g.description, value: g.catId };
                });
                setGenres(updatedGenres);
                setFilteredGenres(updatedGenres);
                setLoading(false);

                // Fetch the book data if the genre is already set
                if (attributes && attributes.genre && attributes.genre.value > 0) {
                    await fetchBookData(attributes.genre);
                    setIsModalOpen(false);
                }
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const loadGenre = async () => {
            if (attributes && attributes.genre && attributes.genre.value > 0) {
                await fetchBookData(attributes.genre);
                setIsModalOpen(false); // Close the modal when genre is set
            }else{
                setIsModalOpen(true); 
            }
        }
        loadGenre();
    }, [attributes.genre]);
    

    const fetchBookData = genre => {
        fetch('https://vickeysen.com/plugin-files/books.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const filteredProduct = data.find(book => book.catId == genre.value);
                setAttributes({ ...attributes, bookData: filteredProduct });
                setBookData(filteredProduct);
            })
            .catch(error => {
                setError(error);
                console.error('Error fetching book data:', error);
            });
    };

    const handleGenreChange = (selectedOption) => {
        const gen = filteredGenres.find(genre => genre.value == selectedOption)
        setIsModalOpen(false);
        setAttributes({ ...attributes, genre: gen });
    };
    
    useEffect(()=>{
        if(error){
            console.error("Error : " + error);
        }
    },[error]);

    return React.createElement(
        'div',
        blockProps,
        React.createElement(
            InspectorControls,
            null,
            React.createElement(
                PanelBody,
                { 
                    title: __('Block Options', 'gutenberg-dropdown-block'),
                    className: "panel-body"
                },
                React.createElement(
                    SelectControl,
                    {
                        label: 'Genre',
                        value: attributes.genre.value,
                        options: genres,
                        onChange: (e) => handleGenreChange(e),
                        className: "genre-select" // Apply class to SelectControl
                    }
                ),
                React.createElement(
                    'span',
                    { className: "genre-text" }, // Apply class to span
                    'Select a genre.'
                )
            )
        ),
        isModalOpen && React.createElement(
            Modal,
            {
                title: __('Choose a genre...', 'gutenberg-dropdown-block'),
                onRequestClose: () => setIsModalOpen(false)
            },
            React.createElement(
                'div',
                null,
                React.createElement(
                    Select,
                    {
                        'aria-labelledby': 'aria-label',
                        inputId: 'aria-example-input',
                        name: 'aria-genre',
                        onChange: (e) => handleGenreChange(e.value),
                        options: genres
                    }
                )
            )
        ),
        loading  && React.createElement(
            'div',
            {
                className: 'loading'
            },
            'Loading...'
        ),
        !isModalOpen && !loading && React.createElement(
            'div', 
            { className: 'bibilioBlock' },
            React.createElement(
                'h2',
                { className: "title" },
                attributes.title
            ),
            React.createElement(
                'img',
                { className: 'bookImg', src: bookData && bookData.image? bookData.image : '' } 
            ),
            React.createElement(
                'span',
                { className: "bookName" }, 
                bookData &&  bookData.name ? bookData.name : ''
            ),
            React.createElement(
                'span',
                { className: "author" }, 
                bookData && bookData.author ? bookData.author : ''
            ),
            React.createElement(
                'div',
                { className: 'buyButtonWrap' },
                React.createElement(
                    'a',
                    { className: 'buyButton', href: bookData && bookData.url ? bookData.url : '#' }, 
                    bookData && bookData.url ? 'BUY FROM AMAZON' : ''
                )
            ),
            React.createElement(
                'div',
                { className: 'bottomLogoWrap' },
                React.createElement(
                    'img',
                    { className: 'bottomLogo', src: logo, alt: 'Logo' } 
                )
            )
        )
    );
};

export default Edit;
