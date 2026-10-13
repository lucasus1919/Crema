'use client';

import React, { useState } from 'react';
import { Plus, Search, Coffee, Store } from 'lucide-react';
import { useMenu } from '@/contexts/MenuContext';
import type { MenuItem } from '@/types';
import { MenuItemCard } from '@/components/admin/MenuItemCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminMenuPage() {
  const {
    items,
    categories,
    selectedCategory,
    setSelectedCategory,
    storeMenus,
    selectedStoreId,
    setSelectedStoreId,
    addItem,
    updateItem,
    deleteItem,
    toggleAvailability,
    createStore,
    loading,
  } = useMenu();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hot Coffee');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Store modal
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setCategory('Hot Coffee');
    setPrice('');
    setModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setPrice(item.price.toString());
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price);
    if (!name || isNaN(numPrice)) return;

    setSubmitting(true);
    try {
      if (editingItem) {
        await updateItem({
          ...editingItem,
          name,
          category,
          price: numPrice,
        });
      } else {
        await addItem({
          name,
          category,
          price: numPrice,
          iconName: 'coffee',
          isAvailable: true,
        });
      }
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;
    await createStore(newStoreName.trim());
    setNewStoreName('');
    setStoreModalOpen(false);
  };

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: '#F5E6D3',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Menu Catalog
          </h1>
          <p style={{ color: 'rgba(245, 230, 211, 0.6)', fontSize: '0.9rem', marginTop: '2px' }}>
            Manage offerings, store variations, pricing, and availability
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" size="md" icon={<Store size={18} />} onClick={() => setStoreModalOpen(true)}>
            Add Store
          </Button>
          <Button variant="primary" size="md" icon={<Plus size={18} />} onClick={openAddModal}>
            New Menu Item
          </Button>
        </div>
      </div>

      {/* Store Switcher bar if multiple stores exist */}
      {storeMenus.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', color: 'rgba(245, 230, 211, 0.6)', fontWeight: 600 }}>
            Store Catalog:
          </span>
          <button
            onClick={() => setSelectedStoreId(null)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: selectedStoreId === null ? '1px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.6)',
              background: selectedStoreId === null ? 'rgba(212, 165, 116, 0.15)' : '#24140E',
              color: selectedStoreId === null ? '#D4A574' : '#F5E6D3',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            Master Catalog
          </button>
          {storeMenus.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStoreId(s.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: selectedStoreId === s.id ? '1px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.6)',
                background: selectedStoreId === s.id ? 'rgba(212, 165, 116, 0.15)' : '#24140E',
                color: selectedStoreId === s.id ? '#D4A574' : '#F5E6D3',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Filter and Search */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <div style={{ flex: 1, maxWidth: '400px' }}>
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: isSelected ? '1px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.6)',
                background: isSelected ? 'rgba(212, 165, 116, 0.2)' : '#24140E',
                color: isSelected ? '#D4A574' : '#F5E6D3',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      {loading ? (
        <Spinner />
      ) : filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(245, 230, 211, 0.4)' }}>
          <Coffee size={44} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No Menu Items Found</p>
          <span style={{ fontSize: '0.875rem' }}>Add your first coffee or snack to get started.</span>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={openEditModal}
              onDelete={deleteItem}
              onToggleAvailability={toggleAvailability}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Item Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Menu Item' : 'New Menu Item'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Item Name"
            placeholder="e.g. Vanilla Oat Latte"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label
              style={{
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'rgba(245, 230, 211, 0.8)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#24140E',
                border: '1px solid rgba(78, 52, 46, 0.7)',
                color: '#F5E6D3',
                fontSize: '0.95rem',
              }}
            >
              <option value="Hot Coffee">Hot Coffee</option>
              <option value="Cold Brew & Iced">Cold Brew & Iced</option>
              <option value="Tea & Chai">Tea & Chai</option>
              <option value="Bakery & Snacks">Bakery & Snacks</option>
              <option value="Specialty">Specialty</option>
            </select>
          </div>

          <Input
            label="Price (₹)"
            type="number"
            step="0.01"
            placeholder="80.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              {editingItem ? 'Save Changes' : 'Create Item'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Store Modal */}
      <Modal
        isOpen={storeModalOpen}
        onClose={() => setStoreModalOpen(false)}
        title="Add Store Branch"
      >
        <form onSubmit={handleCreateStore} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Store Name"
            placeholder="e.g. Downtown Roastery"
            value={newStoreName}
            onChange={(e) => setNewStoreName(e.target.value)}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <Button variant="ghost" type="button" onClick={() => setStoreModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Branch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
