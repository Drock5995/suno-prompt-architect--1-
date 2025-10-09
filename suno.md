# Generate Suno AI Music

## OpenAPI

````yaml suno-api/suno-api.json post /api/v1/generate
paths:
  path: /api/v1/generate
  method: post
  servers:
    - url: https://api.sunoapi.org
      description: API Server
  request:
    security:
      - title: BearerAuth
        parameters:
          query: {}
          header:
            Authorization:
              type: http
              scheme: bearer
              description: >-
                # 🔑 API Authentication


                All endpoints require authentication using Bearer Token.


                ## Get API Key


                1. Visit the [API Key Management
                Page](https://sunoapi.org/api-key) to obtain your API Key


                ## Usage


                Add to request headers:


                ```

                Authorization: Bearer YOUR_API_KEY

                ```


                > **⚠️ Note:**

                > - Keep your API Key secure and do not share it with others

                > - If you suspect your API Key has been compromised, reset it
                immediately from the management page
          cookie: {}
    parameters:
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              prompt:
                allOf:
                  - type: string
                    description: >-
                      A description of the desired audio content.  

                      - In Custom Mode (`customMode: true`): Required if
                      `instrumental` is `false`. The prompt will be strictly
                      used as the lyrics and sung in the generated track.
                      Character limits by model:  
                        - **V3_5 & V4**: Maximum 3000 characters  
                        - **V4_5, V4_5PLUS & V5**: Maximum 5000 characters  
                        Example: "A calm and relaxing piano track with soft melodies"  
                      - In Non-custom Mode (`customMode: false`): Always
                      required. The prompt serves as the core idea, and lyrics
                      will be automatically generated based on it (not strictly
                      matching the input). Maximum 500 characters.  
                        Example: "A short relaxing piano tune"
                    example: A calm and relaxing piano track with soft melodies
              style:
                allOf:
                  - type: string
                    description: >-
                      The music style or genre for the audio.  

                      - Required in Custom Mode (`customMode: true`). Examples:
                      "Jazz", "Classical", "Electronic". 
                        - For V3_5 and V4 models: Max length: 200 characters. 
                        - For V4_5, V4_5PLUS and V5 models: Max length: 1000 characters.  
                        Example: "Classical"  
                      - In Non-custom Mode (`customMode: false`): Leave empty.
                    example: Classical
              title:
                allOf:
                  - type: string
                    description: >-
                      The title of the generated music track.  

                      - Required in Custom Mode (`customMode: true`). Max
                      length: 80 characters.  
                        Example: "Peaceful Piano Meditation"  
                      - In Non-custom Mode (`customMode: false`): Leave empty.
                    example: Peaceful Piano Meditation
              customMode:
                allOf:
                  - type: boolean
                    description: >-
                      Enables Custom Mode for advanced audio generation
                      settings.  

                      - Set to `true` to use Custom Mode (requires `style` and
                      `title`; `prompt` required if `instrumental` is `false`).
                      The prompt will be strictly used as lyrics if
                      `instrumental` is `false`.  

                      - Set to `false` for Non-custom Mode (only `prompt` is
                      required). Lyrics will be auto-generated based on the
                      prompt.
                    example: true
              instrumental:
                allOf:
                  - type: boolean
                    description: >-
                      Determines if the audio should be instrumental (no
                      lyrics).  

                      - In Custom Mode (`customMode: true`):  
                        - If `true`: Only `style` and `title` are required.  
                        - If `false`: `style`, `title`, and `prompt` are required (with `prompt` used as the exact lyrics).  
                      - In Non-custom Mode (`customMode: false`): No impact on
                      required fields (`prompt` only). Lyrics are auto-generated
                      if `instrumental` is `false`.
                    example: true
              model:
                allOf:
                  - type: string
                    description: |-
                      The model version to use for audio generation.   
                      - Available options:  
                        - **`V5`**: Superior musical expression, faster generation.  
                        - **`V4_5PLUS`**: V4.5+ is richer sound, new ways to create, max 8 min.  
                        - **`V4_5`**: Superior genre blending with smarter prompts and faster output, up to 8 minutes.  
                        - **`V4`**: Best audio quality with refined song structure, up to 4 minutes.  
                        - **`V3_5`**: Solid arrangements with creative diversity, up to 4 minutes.
                    enum:
                      - V3_5
                      - V4
                      - V4_5
                      - V4_5PLUS
                      - V5
                    example: V3_5
              negativeTags:
                allOf:
                  - type: string
                    description: >-
                      Music styles or traits to exclude from the generated
                      audio.  

                      - Optional. Use to avoid specific styles.  
                        Example: "Heavy Metal, Upbeat Drums"
                    example: Heavy Metal, Upbeat Drums
              vocalGender:
                allOf:
                  - type: string
                    description: Preferred vocal gender for generated vocals. Optional.
                    enum:
                      - m
                      - f
                    example: m
              styleWeight:
                allOf:
                  - type: number
                    description: Weight of the provided style guidance. Range 0.00–1.00.
                    minimum: 0
                    maximum: 1
                    multipleOf: 0.01
                    example: 0.65
              weirdnessConstraint:
                allOf:
                  - type: number
                    description: Constraint on creative deviation/novelty. Range 0.00–1.00.
                    minimum: 0
                    maximum: 1
                    multipleOf: 0.01
                    example: 0.65
              audioWeight:
                allOf:
                  - type: number
                    description: >-
                      Weight of the input audio influence (where applicable).
                      Range 0.00–1.00.
                    minimum: 0
                    maximum: 1
                    multipleOf: 0.01
                    example: 0.65
              callBackUrl:
                allOf:
                  - type: string
                    format: uri
                    description: >-
                      The URL to receive task completion notifications when
                      music generation is complete.


                      For detailed callback format and implementation guide, see
                      [Music Generation Callbacks](./generate-music-callbacks)

                      - Alternatively, you can use the get music generation
                      details endpoint to poll task status
                    example: https://api.example.com/callback
            required: true
            requiredProperties:
              - customMode
              - instrumental
              - callBackUrl
              - model
        examples:
          example:
            value:
              prompt: A calm and relaxing piano track with soft melodies
              style: Classical
              title: Peaceful Piano Meditation
              customMode: true
              instrumental: true
              model: V3_5
              negativeTags: Heavy Metal, Upbeat Drums
              vocalGender: m
              styleWeight: 0.65
              weirdnessConstraint: 0.65
              audioWeight: 0.65
              callBackUrl: https://api.example.com/callback
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - type: integer
                    description: >-
                      # Status Codes


                      - ✅ 200 - Request successful

                      - ⚠️ 400 - Invalid parameters

                      - ⚠️ 401 - Unauthorized access

                      - ⚠️ 404 - Invalid request method or path

                      - ⚠️ 405 - Rate limit exceeded

                      - ⚠️ 413 - Theme or prompt too long

                      - ⚠️ 429 - Insufficient credits

                      - ⚠️ 430 - Your call frequency is too high. Please try
                      again later. 

                      - ⚠️ 455 - System maintenance

                      - ❌ 500 - Server error
                    example: 200
                    enum:
                      - 200
                      - 400
                      - 401
                      - 404
                      - 405
                      - 413
                      - 429
                      - 430
                      - 455
                      - 500
              msg:
                allOf:
                  - type: string
                    description: Error message when code != 200
                    example: success
              data:
                allOf:
                  - type: object
                    properties:
                      taskId:
                        type: string
                        description: Task ID for tracking task status
                        example: 5c79****be8e
            refIdentifier: '#/components/schemas/ApiResponse'
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                taskId: 5c79****be8e
        description: Request successful
    '500':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Server error
        examples: {}
        description: Server error
  deprecated: false
  type: path
components:
  schemas: {}

````