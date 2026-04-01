


export async function depthCalculator(request: Request, response: Response): Promise<void> {
  try {

    //
    const validatedRequest = CalculatorSchema.pick({ id: true }).safeParse(request.params)
    if (!validatedRequest.success) {

    }

  } catch (error: any) {
    console.error(error)
    serverErrorResponse(error, error.message)
  }
}