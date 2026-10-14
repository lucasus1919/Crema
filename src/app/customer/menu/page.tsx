'use client';

import React, { useState } from 'react';
import { Coffee, Search, Plus, Sparkles } from 'lucide-react';
import { useMenu } from '@/contexts/MenuContext';
import { useOrders } from '@/contexts/OrderContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ItemImage } from '@/components/ui/ItemImage';

export default function CustomerMenuPage() {
  const { items, categories, selectedCategory, setSelectedCategory, loading } = useMenu();
  const { addToCart } = useOrders();
  const [search, setSearch] = useState('');

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #3D2317 0%, #24140E 100%)',
          borderRadius: '20px',
          padding: '28px 32px',
          border: '1px solid rgba(78, 52, 46, 0.7)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4A574', marginBottom: '6px' }}>
            <Sparkles size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Fresh Batch Roasts
            </span>
          </div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#F5E6D3',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Handcrafted Coffee & Treats
          </h1>
          <p style={{ color: 'rgba(245, 230, 211, 0.7)', fontSize: '0.95rem', marginTop: '6px', maxWidth: '540px' }}>
            Single-origin espresso, silky cold brews, and artisan bakery made fresh every morning.
          </p>
        </div>

        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '24px',
            background: 'rgba(212, 165, 116, 0.15)',
            border: '1px solid rgba(212, 165, 116, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#D4A574',
          }}
        >
          <Coffee size={46} />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <div style={{ flex: 1, maxWidth: '420px' }}>
          <Input
            placeholder="Search our drink catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
      </div>

      {/* Category selector */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: isSelected ? '1px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.6)',
                background: isSelected ? 'linear-gradient(135deg, #D4A574 0%, #C08A56 100%)' : '#24140E',
                color: isSelected ? '#1A1210' : '#F5E6D3',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Menu Cards Grid */}
      {loading ? (
        <Spinner size={36} />
      ) : filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(245, 230, 211, 0.4)' }}>
          <Coffee size={42} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No Drinks Found</p>
          <span style={{ fontSize: '0.85rem' }}>Try searching another keyword or category.</span>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '22px',
          }}
        >
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              variant="surface"
              padding="none"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                opacity: item.isAvailable ? 1 : 0.6,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
              }}
            >
              {/* Image banner */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '185px',
                  overflow: 'hidden',
                  backgroundColor: '#1E120D',
                }}
              >
                <ItemImage item={item} size="fill" />

                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(26, 18, 16, 0.85)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(212, 165, 116, 0.35)',
                    color: '#D4A574',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.category}
                </div>

                {!item.isAvailable && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <Badge variant="danger" size="sm">Sold Out</Badge>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: '18px 20px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  flex: 1,
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#F5E6D3',
                      fontFamily: 'var(--font-heading)',
                      marginBottom: '4px',
                    }}
                  >
                    {item.name}
                  </h3>
                  <span style={{ fontSize: '0.825rem', color: 'rgba(245, 230, 211, 0.55)' }}>
                    Artisan roast &bull; {item.category}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(78, 52, 46, 0.45)',
                    paddingTop: '14px',
                  }}
                >
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#D4A574' }}>
                    ₹{item.price.toFixed(2)}
                  </span>

                  <button
                    disabled={!item.isAvailable}
                    onClick={() => addToCart(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 18px',
                      borderRadius: '10px',
                      background: item.isAvailable
                        ? 'linear-gradient(135deg, #D4A574 0%, #C08A56 100%)'
                        : 'rgba(78, 52, 46, 0.4)',
                      color: item.isAvailable ? '#1A1210' : 'rgba(245, 230, 211, 0.4)',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: item.isAvailable ? 'pointer' : 'not-allowed',
                      transition: 'transform 0.15s ease',
                      boxShadow: item.isAvailable ? '0 2px 8px rgba(212, 165, 116, 0.25)' : 'none',
                    }}
                  >
                    <Plus size={16} />
                    Add to Bag
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
