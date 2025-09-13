import React from 'react'
import { render, screen } from '@testing-library/react'
import { CalgaryBusinessGrid } from '@/components/CalgaryBusinessGrid'
import type { Business } from '@/types/business'

const mockBusinesses: Business[] = [
  {
    id: '1',
    calgary_id: 'TEST001',
    tradename: 'Test Business 1',
    address: '123 Test St, Calgary, AB',
    community: 'Downtown',
    license_type: 'Business License',
    first_issued_date: '2024-01-15',
    slug: 'test-business-1',
    category: 'restaurant',
    is_consumer_facing: true,
    latitude: 51.0447,
    longitude: -114.0719,
    view_count: 10,
    active: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    calgary_id: 'TEST002',
    tradename: 'Test Business 2',
    address: '456 Test Ave, Calgary, AB',
    community: 'Kensington',
    license_type: 'Business License',
    first_issued_date: '2024-02-01',
    slug: 'test-business-2',
    category: 'retail',
    is_consumer_facing: true,
    latitude: 51.0547,
    longitude: -114.0819,
    view_count: 5,
    active: true,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
]

describe('CalgaryBusinessGrid', () => {
  it('renders business grid with businesses', () => {
    render(<CalgaryBusinessGrid businesses={mockBusinesses} />)
    
    expect(screen.getByText('Test Business 1')).toBeInTheDocument()
    expect(screen.getByText('Test Business 2')).toBeInTheDocument()
  })

  it('displays business addresses', () => {
    render(<CalgaryBusinessGrid businesses={mockBusinesses} />)
    
    expect(screen.getByText('123 Test St, Calgary, AB')).toBeInTheDocument()
    expect(screen.getByText('456 Test Ave, Calgary, AB')).toBeInTheDocument()
  })

  it('shows community information', () => {
    render(<CalgaryBusinessGrid businesses={mockBusinesses} />)
    
    expect(screen.getByText('Downtown')).toBeInTheDocument()
    expect(screen.getByText('Kensington')).toBeInTheDocument()
  })

  it('renders empty state when no businesses provided', () => {
    render(<CalgaryBusinessGrid businesses={[]} />)
    
    expect(screen.getByText(/no businesses found/i)).toBeInTheDocument()
  })

  it('applies correct category styling', () => {
    render(<CalgaryBusinessGrid businesses={mockBusinesses} />)
    
    // Check that category badges are rendered
    expect(screen.getByText('restaurant')).toBeInTheDocument()
    expect(screen.getByText('retail')).toBeInTheDocument()
  })

  it('makes business cards clickable', () => {
    render(<CalgaryBusinessGrid businesses={mockBusinesses} />)
    
    const businessLinks = screen.getAllByRole('link')
    expect(businessLinks).toHaveLength(2)
    
    expect(businessLinks[0]).toHaveAttribute('href', '/business/test-business-1')
    expect(businessLinks[1]).toHaveAttribute('href', '/business/test-business-2')
  })
})