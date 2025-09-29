'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  IndianRupee,
  Search,
  RefreshCw,
  Edit,
  Plus,
  Filter,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Star,
  Users
} from 'lucide-react'

interface ServicePricing {
  id: string
  name: string
  category: string
  description: string
  basePrice: number
  discountPrice?: number
  duration: number // in minutes
  isActive: boolean
  popularity: number // 1-5 scale
  bookingCount: number
  lastUpdated: string
  tags: string[]
}

export function ServicesPricingPage() {
  const [services, setServices] = useState<ServicePricing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [editingService, setEditingService] = useState<string | null>(null)

  useEffect(() => {
    fetchServicesPricing()
  }, [])

  const fetchServicesPricing = async () => {
    setLoading(true)
    try {
      // Mock data for now - replace with actual API call
      const mockServices: ServicePricing[] = [
        {
          id: '1',
          name: 'Dental Cleaning',
          category: 'Preventive',
          description: 'Professional dental cleaning and polishing',
          basePrice: 2500,
          duration: 60,
          isActive: true,
          popularity: 5,
          bookingCount: 89,
          lastUpdated: new Date().toISOString(),
          tags: ['routine', 'preventive', 'cleaning']
        },
        {
          id: '2',
          name: 'Teeth Whitening',
          category: 'Cosmetic',
          description: 'Professional teeth whitening treatment',
          basePrice: 8000,
          discountPrice: 6500,
          duration: 90,
          isActive: true,
          popularity: 4,
          bookingCount: 67,
          lastUpdated: new Date(Date.now() - 86400000).toISOString(),
          tags: ['cosmetic', 'whitening', 'aesthetic']
        },
        {
          id: '3',
          name: 'Root Canal Treatment',
          category: 'Restorative',
          description: 'Root canal therapy for infected teeth',
          basePrice: 15000,
          duration: 120,
          isActive: true,
          popularity: 3,
          bookingCount: 34,
          lastUpdated: new Date(Date.now() - 172800000).toISOString(),
          tags: ['treatment', 'endodontic', 'restorative']
        },
        {
          id: '4',
          name: 'Dental Implants',
          category: 'Surgical',
          description: 'Single tooth implant with crown',
          basePrice: 45000,
          duration: 180,
          isActive: true,
          popularity: 4,
          bookingCount: 12,
          lastUpdated: new Date(Date.now() - 259200000).toISOString(),
          tags: ['implant', 'surgical', 'replacement']
        },
        {
          id: '5',
          name: 'Orthodontic Consultation',
          category: 'Orthodontics',
          description: 'Initial consultation for braces/aligners',
          basePrice: 1500,
          duration: 45,
          isActive: true,
          popularity: 4,
          bookingCount: 56,
          lastUpdated: new Date(Date.now() - 345600000).toISOString(),
          tags: ['consultation', 'orthodontics', 'braces']
        },
        {
          id: '6',
          name: 'Emergency Treatment',
          category: 'Emergency',
          description: 'Urgent dental care for emergencies',
          basePrice: 3500,
          duration: 60,
          isActive: true,
          popularity: 3,
          bookingCount: 23,
          lastUpdated: new Date(Date.now() - 432000000).toISOString(),
          tags: ['emergency', 'urgent', 'pain relief']
        }
      ]

      setServices(mockServices)
    } catch (error) {
      console.error('Error fetching services pricing:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'preventive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'cosmetic':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'restorative':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'surgical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'orthodontics':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'emergency':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getPopularityStars = (popularity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < popularity ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || service.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(services.map(s => s.category)))
  const totalRevenue = services.reduce((sum, service) => 
    sum + (service.discountPrice || service.basePrice) * service.bookingCount, 0
  )
  const averagePrice = services.reduce((sum, service) => 
    sum + (service.discountPrice || service.basePrice), 0
  ) / services.length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services & Pricing</h1>
          <p className="text-muted-foreground">
            Manage service offerings, pricing, and availability
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">
              Active services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From all services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averagePrice)}</div>
            <p className="text-xs text-muted-foreground">
              Per service
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.reduce((sum, service) => sum + service.bookingCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              All time bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Pricing Management</CardTitle>
          <CardDescription>
            Manage your dental services, pricing, and availability
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Popularity</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {service.description}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {service.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(service.category)}>
                      {service.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {service.discountPrice ? (
                        <>
                          <span className="font-medium text-green-600">
                            {formatCurrency(service.discountPrice)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(service.basePrice)}
                          </span>
                        </>
                      ) : (
                        <span className="font-medium">
                          {formatCurrency(service.basePrice)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{service.duration} min</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getPopularityStars(service.popularity)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">{service.bookingCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={service.isActive ? 
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingService(service.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredServices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No services found</p>
              {searchTerm && (
                <p className="text-sm">Try adjusting your search criteria</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
