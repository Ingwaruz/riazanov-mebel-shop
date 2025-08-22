import React, { useState, useEffect, useRef } from 'react';
import './OptimizedImage.scss';

const OptimizedImage = ({ 
    src, 
    alt, 
    className = '', 
    width, 
    height, 
    sizes = '(max-width: 767px) 100vw, 50vw',
    placeholder = '/placeholder.svg',
    priority = false,
    quality = 75
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const [currentSrc, setCurrentSrc] = useState(placeholder);
    const [error, setError] = useState(false);
    const imgRef = useRef();

    // Intersection Observer для lazy loading
    useEffect(() => {
        if (priority) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [priority]);

    // Создание responsive srcSet
    const createSrcSet = (baseSrc) => {
        if (!baseSrc || baseSrc === placeholder) return '';
        
        const extension = baseSrc.match(/\.(jpg|jpeg|png|webp)$/i)?.[1] || 'jpg';
        const basePath = baseSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '');
        
        return [
            `${basePath}-small.${extension} 400w`,
            `${basePath}-medium.${extension} 800w`,
            `${basePath}-large.${extension} 1200w`
        ].join(', ');
    };

    // Загрузка изображения
    useEffect(() => {
        if (!isInView || !src) return;

        const img = new Image();
        
        img.onload = () => {
            setCurrentSrc(src);
            setIsLoaded(true);
            setError(false);
        };
        
        img.onerror = () => {
            setError(true);
            setCurrentSrc(placeholder);
            console.error('Failed to load image:', src);
        };

        img.src = src;
    }, [isInView, src, placeholder]);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    const handleImageError = () => {
        setError(true);
        setCurrentSrc(placeholder);
    };

    return (
        <div className={`optimized-image-container ${className}`} ref={imgRef}>
            {/* WebP version */}
            <picture>
                <source
                    type="image/webp"
                    srcSet={createSrcSet(src?.replace(/\.(jpg|jpeg|png)$/i, '.webp'))}
                    sizes={sizes}
                />
                <source
                    type={`image/${src?.match(/\.(jpg|jpeg|png)$/i)?.[1] || 'jpeg'}`}
                    srcSet={createSrcSet(src)}
                    sizes={sizes}
                />
                <img
                    src={currentSrc}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    className={`optimized-image ${isLoaded ? 'loaded' : 'loading'} ${error ? 'error' : ''}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    width={width}
                    height={height}
                    decoding="async"
                />
            </picture>
            
            {/* Skeleton loader */}
            {!isLoaded && !error && (
                <div className="image-skeleton">
                    <div className="skeleton-shimmer"></div>
                </div>
            )}
        </div>
    );
};

export default OptimizedImage; 