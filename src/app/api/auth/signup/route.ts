import { hash } from 'bcrypt'
import { User } from '@/models/User'
import dbConnect from '@/lib/mongoose'
import { registerSchema } from '@/schemas/auth.schema'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = registerSchema.parse(body)

    await dbConnect()

    // Email kontrolü
    const existingUser = await User.findOne({ email: validatedData.email })
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'Email already registered' }), 
        { status: 400 }
      )
    }

    // Şifreyi hashle
    const hashedPassword = await hash(validatedData.password, 12)

    // Yeni kullanıcı oluştur
    await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword
    })

    return new Response(
      JSON.stringify({ message: 'User created successfully' }), 
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    return new Response(
      JSON.stringify({ message: error.message }), 
      { status: 500 }
    )
  }
} 